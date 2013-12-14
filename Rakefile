require "bundler"
require "rake/testtask"

begin
  Bundler.setup
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end

namespace :app do
  desc "Run application using shotgun"
  task :start do
    system "shotgun --server=thin --host=0.0.0.0 --port=9292 config.ru"
  end
end