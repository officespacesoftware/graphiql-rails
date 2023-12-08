# frozen_string_literal: true

module GraphiQL
  module Rails
    # The `EditorsController` is responsible for rendering the GraphiQL editor.
    # It provides helper methods for accessing the `explorer_plugin_enabled`,
    # `graphql_endpoint_path`, and `theme` parameters.
    class EditorsController < ActionController::Base
      before_action :developer_api_enabled?
      helper_method :explorer_plugin_enabled, :graphql_endpoint_path, :theme

      def show; end

      def explorer_plugin_enabled
        params[:explorer] && params[:explorer] == 'true'
      end

      def graphql_endpoint_path
        params[:graphql_path] || raise(%(You must include `graphql_path: "/my/endpoint"` when mounting GraphiQL::Rails::Engine))
      end

      def theme
        params[:theme]
      end

      def developer_api_enabled?
        redirect_to '/unauthorized' unless ::FeatureManagement::Launchdarkly['developer_API.enable']
      end
    end
  end
end
