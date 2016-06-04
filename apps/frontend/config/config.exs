# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :frontend, Frontend.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "BHUeUZ0EG+ZyQ+AbomFbEPp517Qk0BiHnHz60VGoGUjAkkPDHj+3TCOCC636YrTU",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: Frontend.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configure gettext
config :frontend, Frontend.Gettext,
  default_locale: "sv"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false

config :guardian, Guardian,
  issuer: "SkissaOchGissa",
  ttl: {30, :days},
  secret_key: "3yFBcitXtnF1myAfVyK6LdB/irH8Mv9+z/axGx9wsmZH58xS7ZrWty3VGx7ff6Fp",
  serializer: Frontend.User.Serializer,
  permissions: %{
    default: [:write_profile],
    admin: [:handle_categories, :handle_users]
  }
