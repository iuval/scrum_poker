require 'rubygems'
require 'bundler'
require 'sinatra'
require 'sinatra-websocket'
require "sinatra/json"
require 'sinatra/flash'
Bundler.require

enable :sessions

set :root, File.dirname(__FILE__)

# Google OAuth2 configuration
use OmniAuth::Builder do
    provider :google_oauth2, NeonTracker::Config::GOOGLE_CLIENT_ID, NeonTracker::Config::GOOGLE_CLIENT_SECRET, {approval_prompt: ''}
    provider :developer if ENV['RACK_ENV'] == 'development'
end