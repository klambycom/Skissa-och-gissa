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

  @doc """
  Check if the words are the same

  TODO Allow spaces around word
  TODO Allow sentences if one of the words is correct?
  TODO Allow misspelled words

  ## Example

      iex> Game.Logic.guess("foo", "bar")
      false

      iex> Game.Logic.guess("foo", "foo")
      true

  `Game.Logic.guess/2` is case-insensitive.

      iex> Game.Logic.guess("FoO", "foo")
      true
  """
  def guess(word1, word2), do: String.downcase(word1) == String.downcase(word2)
end
