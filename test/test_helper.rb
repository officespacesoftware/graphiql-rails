require "codeclimate-test-reporter"
CodeClimate::TestReporter.start

ENV["RAILS_ENV"] = "test"
require File.expand_path("../dummy/config/environment.rb", __FILE__)
require "rails/test_help"
require "rails/generators"
require 'minitest/mock'

class DeveloperApi
  def self.feature_enabled?(current_user = nil)
    true
  end
end

def current_user
  nil
end

Rails.backtrace_cleaner.remove_silencers!

Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each { |f| require f }
