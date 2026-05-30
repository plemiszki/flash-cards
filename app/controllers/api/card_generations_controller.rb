class Api::CardGenerationsController < AdminController

  CARD_TOOL = {
    name: "create_flash_cards",
    description: "Output an array of flash cards in response to the user's prompt.",
    input_schema: {
      type: "object",
      properties: {
        cards: {
          type: "array",
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
      required: ["cards"],
    },
  }.freeze

  def create
    prompt = params[:prompt].to_s.strip
    if prompt.blank?
      render json: { error: "Prompt is required." }, status: 422
      return
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
        system:      "You generate flash cards. For simple Q&A cards include 'question' and 'answer'. For matching/categorization cards include 'question' and 'matchBins' (array of {label, items}) but no 'answer'.",
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

    cards = response.parsed_response.dig("content", 0, "input", "cards")
    unless cards.is_a?(Array)
      render json: { error: "Unexpected response structure from AI." }, status: 502
      return
    end

    render json: { cards: cards }
  end

end
