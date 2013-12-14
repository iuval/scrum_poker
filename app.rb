require 'rubygems'
require 'bundler'
require 'sinatra'
require 'sinatra-websocket'
require "sinatra/json"
Bundler.require

set :root, File.dirname(__FILE__)

set :server, 'thin'
set :connections, []

get '/' do
  if !request.websocket?
    haml :index
  else
    request.websocket do |ws|
      ws.onopen do
        new_id = rand(100)
        ws.send json(action: 'enter-room',
          id: new_id,
          member_ids: settings.connections.map { |c| c[:id] })

        EM.next_tick do
          settings.connections.each do |c|
            c[:ws].send json(action: 'new-connection',
              id: new_id)
          end
        end
        settings.connections << { id: new_id, ws: ws }
      end

      ws.onmessage do |msg|
        json = JSON.parse(msg)
        EM.next_tick do
          settings.connections.each do |s|
            s[:ws].send(json(action: json['action'],
              id: json['id'],
              data: json['data']))
          end
        end
      end

      ws.onclose do
        warn("wetbsocket closed")
        lost_conn = settings.connections.detect { |c| c[:ws] == ws }
        settings.connections.delete lost_conn

        EM.next_tick do
          settings.connections.each do |c|
            c[:ws].send json(action: 'lost-connection',
              id: lost_conn[:id])
          end
        end
      end
    end
  end
end