class FetchWordDefinitions
  include Sidekiq::Worker
  sidekiq_options :retry => false

  def perform(args)
    job = Job.find(args['job_id'])
    words = args['words']
    result = {}
    words.each do |word|
      response = HTTParty.get("https://wordsapiv1.p.mashape.com/words/#{word}", headers: { 'X-Mashape-Key' => ENV['WORDS_API_KEY'] })
      if response.has_key?('message') && response['message'] == 'word not found'
        result[word] = nil
      else
        definitions = response['results'].map { |result| result['definition'] }
        result[word] = definitions
      end
      job.update(current_value: job.current_value + 1)
    end
    job.update(done: true, metadata: result)
  end

end
