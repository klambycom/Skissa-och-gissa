ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Frontend.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Frontend.Repo --quiet)
Ecto.Adapters.SQL.Sandbox.mode(Frontend.Repo, :manual)

