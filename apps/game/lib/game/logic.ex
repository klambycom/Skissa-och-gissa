defmodule Game.Logic do
  @moduledoc """
  Handle game logic
  """

  @doc """
  Get random word from the word list

  ## Example

      iex> {word, words} = Game.Logic.random(["foo", "bar", "baz"])
      ...> word in words
      false
      ...> length(words)
      2
  """
  def random(words) do
    word = Enum.random(words)
    {word, List.delete(words, word)}
  end
end
