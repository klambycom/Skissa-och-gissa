defmodule Game.Room do
  use GenServer

  @doc """
  Create a new room and set a random word
  """
  def new(words, opts \\ %{}) do
    # Create and/or set a id
    id = opts[:id] || UUID.uuid4()

    # Set number of rounds left
    rounds = opts[:rounds] || 20

    # Set first word and the rest of the words
    {word, words} = if opts[:word] do
      {opts[:word], words}
    else
      Game.Logic.random(words)
    end

    # Create the room
    {:ok, pid} = GenServer.start_link(
      __MODULE__,
      %{id: id, words: words, word: word, rounds: rounds}
    )

    {:ok, pid}
  end

  @doc """
  Get the id of the room

  ## Example

      iex> {:ok, room} = Game.Room.new(["foo", "bar", "baz"], %{id: "unique_id"})
      ...> Game.Room.id(room)
      "unique_id"
  """
  def id(room), do: GenServer.call(room, :id)

  @doc """
  Guess what the current word is. A new rounds will start if the guess is
  correct, and a new word will be selected.

  ## Example

      iex> {:ok, room} = Game.Room.new(["foo", "bar", "baz"])
      ...> Game.Room.guess(room, "wrong")
      false

      iex> {:ok, room} = Game.Room.new(["foo", "bar", "baz"])
      ...> Game.Room.guess(room, Game.Room.word(room))
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

  def init(state), do: {:ok, state}

  def handle_call(:id, _, state), do: {:reply, state.id, state}

  def handle_call({:guess, word}, _, state) do
    if Game.Logic.guess(word, state.word) do
      {word, words} = Game.Logic.random(state.words)

      state = Map.put(state, :word, word)
      state = Map.put(state, :words, words)
      state = Map.put(state, :rounds, state.rounds - 1)

      {:reply, true, state}
    else
      {:reply, false, state}
    end
  end

  def handle_call(:words, _, state), do: {:reply, state.words, state}

  def handle_call(:word, _, state), do: {:reply, state.word, state}

  def handle_call(:rounds, _, state), do: {:reply, state.rounds, state}
end
