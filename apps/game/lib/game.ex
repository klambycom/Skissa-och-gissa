defmodule Game do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      supervisor(Game.Repo, []),
      supervisor(Game.Supervisor, [])
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
