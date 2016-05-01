defmodule Game.Player do
  defstruct id: nil, score: 0

  def new(id), do: %__MODULE__{id: id}
end
