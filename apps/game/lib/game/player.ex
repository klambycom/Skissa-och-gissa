defmodule Game.Player do
  use GenEvent
  require Logger

  defstruct id: nil, score: 0, callback: nil

  def new(id), do: %__MODULE__{id: id}

  def new(id, callback), do: %__MODULE__{id: id}

  def handle_event(event, parent) do
    Logger.info("event received: #{inspect event}, parent: #{inspect parent}")
    {:ok, parent}
  end
end
