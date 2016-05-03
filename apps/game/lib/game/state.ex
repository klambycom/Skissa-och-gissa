defmodule Game.State do
  @moduledoc """
  The state of a game/server.
  """

  defstruct id: nil,
            name: nil,
            description: nil,
            rounds_left: 0,
            words: nil,
            word: nil,
            players: []

  @max_rounds 20

  @doc """
  Create a new state for a game/server (`Game.Server`) from words and sets nr
  of rounds to default or nr of words. A ID is generated and a random word
  is set from the words.
  """
  def new(name, description, words) do
    {word, words} = random_word(words)

    %__MODULE__{
      id: UUID.uuid4(),
      name: name,
      description: description,
      words: words,
      word: word,
      rounds_left: Enum.min([@max_rounds, length(words)])
    }
  end

  @doc """
  Set new random word from the words.

  ## Example

      iex> state = Game.State.new("Game", "", ["moon", "TV", "sword"])
      ...> state = Game.State.new_word(state)
      ...> state.word in state.words
      false
  """
  def new_word(state) do
    {word, words} = random_word(state.words)

    %__MODULE__{
      state | word: word, words: words, rounds_left: state.rounds_left - 1
    }
  end

  @doc """
  Create new state from a `%Game.Database.Category{}`.
  """
  def from_category(category) do
    words = Enum.map(category.words, fn(%{word: word}) -> word end)
    new(category.name, category.description, words)
  end

  defp random_word(words) do
    word = Enum.random(words)
    {word, List.delete(words, word)}
  end
end
