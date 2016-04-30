defmodule Game.Word do
  @moduledoc """
  Handle word logic in the game.
  """

  @doc """
  Check if the words are the same

  TODO Allow spaces around word
  TODO Allow sentences if one of the words is correct?
  TODO Allow misspelled words

  ## Example

      iex> Game.Word.compare("foo", "bar")
      false

      iex> Game.Word.compare("foo", "foo")
      true

  `Game.Word.compare/2` is case-insensitive.

      iex> Game.Word.compare("FoO", "foo")
      true
  """
  def compare(word1, word2), do: String.downcase(word1) == String.downcase(word2)
end
