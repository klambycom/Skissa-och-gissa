defmodule Game.State do
  @moduledoc """
  The state of a game/server.
  """

  defstruct id: nil, rounds_left: 0, words: nil, word: nil, players: []

  @max_rounds 20

  @doc """
  Create a new state for a game/server (`Game.Server`) from words and sets nr
  of rounds to default or specified value. A ID is generated and a random word
  is set from the words.
  """
  def new(words, nr_of_rounds) do
    {word, words} = random_word(words)

    %__MODULE__{
      id: UUID.uuid4(),
      words: words,
      word: word,
      rounds_left: Enum.min([nr_of_rounds, length(words)])
    }
  end

  def new(words), do: new(words, @max_rounds)

  @doc """
  Set new random word from the words.

  ## Example

      iex> state = Game.State.new(id: 2, words: ["moon", "TV", "sword"], word: "x")
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

  defp random_word(words) do
    word = Enum.random(words)
    {word, List.delete(words, word)}
  end
end
