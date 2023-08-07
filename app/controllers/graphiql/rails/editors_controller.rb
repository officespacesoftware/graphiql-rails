module GraphiQL
  module Rails
    class EditorsController < ActionController::Base
      helper_method :graphql_endpoint_path, :explorer_plugin_enabled

      def show; end

      def graphql_endpoint_path
        params[:graphql_path] || raise(%(You must include `graphql_path: "/my/endpoint"` when mounting GraphiQL::Rails::Engine))
      end

      def explorer_plugin_enabled
        params[:explorer] && params[:explorer] == 'true'
      end
    end
  end
end
