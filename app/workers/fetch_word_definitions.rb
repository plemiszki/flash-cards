class FetchWordDefinitions
  include Sidekiq::Worker
  sidekiq_options :retry => false

  def perform(job_id, words)
    job = Job.find(job_id)
    result = {}
    words.each do |word|
      response = HTTParty.get("https://wordsapiv1.p.rapidapi.com/words/#{word}", headers: { 'X-Mashape-Key' => ENV['WORDS_API_KEY'] })
      if response.has_key?('results')
        definitions = response['results'].map { |result| result['definition'] }
        result[word] = definitions
      else
        result[word] = nil
      end
      job.update(current_value: job.current_value + 1)
    end
    job.update(done: true, metadata: result)
  end

end
