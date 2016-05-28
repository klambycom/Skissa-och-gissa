use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :frontend, Frontend.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :frontend, Frontend.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "christian",
  password: "",
  database: "frontend_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
