defmodule Game.State do
  defstruct id: nil, rounds_left: 0, words: nil, word: nil

  @max_rounds 20

  @doc """
  Create a new state for a game/server (`Game.Server`).

  ## Example

      iex> Game.State.new(id: 123, words: ["moon", "TV"], word: "hand")
      %Game.State{id: 123, words: ["moon", "TV"], word: "hand", rounds_left: 2}
  """
  def new(opts \\ %{}) do
    {word, words} = get_words(opts[:word], opts[:words])

    %__MODULE__{
      id: get_id(opts[:id]),
      words: words,
      word: word,
      rounds_left: get_rounds_left(words, opts[:rounds_left])
    }
  end

  @doc """
  Set new random word from the words.

  ## Example

      iex> state = Game.State.new(id: 2, words: ["moon", "TV", "sword"], word: "x")
      ...> state = Game.State.new_word(state)
      ...> state.word in state.words
      false
  """
  def new_word(state) do
    {word, words} = get_random(state.words)

    %__MODULE__{
      state | word: word, words: words, rounds_left: state.rounds_left - 1
    }
  end

  defp get_id(id), do: id || UUID.uuid4()

  defp get_words(word, nil), do: {word, []}
  defp get_words(nil, words), do: get_random(words)
  defp get_words(word, words), do: {word, words}

  defp get_rounds_left(words, rounds_left),
    do: Enum.min([rounds_left || @max_rounds, length(words)])

  defp get_random(words) do
    word = Enum.random(words)
    {word, List.delete(words, word)}
  end
end
