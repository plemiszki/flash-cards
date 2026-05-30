class Api::CardGenerationsController < AdminController

  CARD_TOOL = {
    name: "create_flash_cards",
    description: "Respond to the user's prompt by generating flash cards or asking clarifying questions.",
    input_schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Your response to the user. Ask clarifying questions if the prompt is ambiguous. Say 'Done.' if you generated cards.",
        },
        cards: {
          type: "array",
          description: "The generated flash cards. Omit if you have questions for the user.",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              answer:   { type: "string" },
              matchBins: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    items: { type: "array", items: { type: "string" } },
                  },
                  required: ["label", "items"],
                },
              },
            },
            required: ["question"],
          },
        },
      },
      required: ["message"],
    },
  }.freeze

  def create
    prompt = params[:prompt].to_s.strip
    if prompt.blank?
      render json: { error: "Prompt is required." }, status: 422
      return
    end

    existing_cards = Array(params[:cards])
    system_prompt = "You generate flash cards used in quizzes where the user must type the answer. Answers must be short — a word, name, date, or brief phrase. Never write a sentence as an answer. If a fact would naturally produce a long answer, reframe the question so the short fact becomes the answer. For example, instead of Q: 'What was New France?' A: 'New France was the area colonized by France...', write Q: 'What was the name of the area colonized by France in North America in the early 17th century?' A: 'New France'. For simple Q&A cards include 'question' and 'answer'. For matching/categorization cards include 'question' and 'matchBins' (array of {label, items}) but no 'answer'. If the prompt is ambiguous or needs clarification, ask the user questions in the message field and omit cards. If you have all the information you need, generate the cards and set message to 'Done.'"
    if existing_cards.any?
      card_list = existing_cards.map { |c| "- #{c[:question]}" }.join("\n")
      system_prompt += "\n\nCards currently in the review queue:\n#{card_list}"
    end

    response = HTTParty.post(
      "https://api.anthropic.com/v1/messages",
      headers: {
        "x-api-key"         => ENV["ANTHROPIC_API_KEY"],
        "anthropic-version" => "2023-06-01",
        "Content-Type"      => "application/json",
      },
      body: {
        model:       "claude-sonnet-4-6",
        max_tokens:  4096,
        system:      system_prompt,
        tools:       [CARD_TOOL],
        tool_choice: { type: "tool", name: "create_flash_cards" },
        messages:    [{ role: "user", content: prompt }],
      }.to_json,
      timeout: 60,
    )

    unless response.success?
      render json: { error: "Anthropic API error: #{response.code}" }, status: 502
      return
    end

    input = response.parsed_response.dig("content", 0, "input")
    unless input.is_a?(Hash) && input["message"].present?
      render json: { error: "Unexpected response structure from AI." }, status: 502
      return
    end

    render json: { message: input["message"], cards: input["cards"] }
  end

end
