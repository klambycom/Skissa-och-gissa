defmodule Game.Server do
  use GenServer

  @moduledoc """
  The room handles words, guesses and players.
  """

  @doc """
  Create a new room and set a random word. The number of rounds is set,
  default is 20 but can never be more than the number of words.
  """
  def new(opts),
    do: GenServer.start_link(__MODULE__, opts)

  @doc """
  Get the id of the room

  ## Example

      iex> {:ok, room} = Game.Server.new(words: ["foo", "bar", "baz"], id: "unique_id")
      ...> Game.Server.id(room)
      "unique_id"
  """
  def id(room), do: GenServer.call(room, :id)

  @doc """
  Guess what the current word is. A new rounds will start if the guess is
  correct, and a new word will be selected.

  ## Example

      iex> {:ok, room} = Game.Server.new(words: ["foo", "bar", "baz"])
      ...> Game.Server.guess(room, "wrong")
      false

      iex> {:ok, room} = Game.Server.new(words: ["foo", "bar", "baz"])
      ...> Game.Server.guess(room, Game.Server.word(room))
      true
  """
  def guess(room, word), do: GenServer.call(room, {:guess, word})

  @doc """
  Return all words
  """
  def words(room), do: GenServer.call(room, :words)

  @doc """
  Return the current word
  """
  def word(room), do: GenServer.call(room, :word)

  @doc """
  Return number of rounds left
  """
  def rounds(room), do: GenServer.call(room, :rounds)

  def init(opts), do: {:ok, Game.State.new(opts)}

  def handle_call(:id, _, state), do: {:reply, state.id, state}

  def handle_call({:guess, word}, _, state) do
    if Game.Logic.guess(word, state.word) do
      {:reply, true, Game.State.new_word(state)}
    else
      {:reply, false, state}
    end
  end

  def handle_call(:words, _, state), do: {:reply, state.words, state}

  def handle_call(:word, _, state), do: {:reply, state.word, state}

  def handle_call(:rounds, _, state), do: {:reply, state.rounds_left, state}
end
