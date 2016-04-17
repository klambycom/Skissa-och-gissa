defmodule Game.Room do
  use GenServer

  @doc """
  Create a new room and set a random word
  """
  def new(words, opts \\ %{}) do
    # Create and/or set a id
    id = opts[:id] || UUID.uuid4()

    # Set first word and the rest of the words
    {word, words} = if opts[:word] do
      {opts[:word], words}
    else
      Game.Logic.random(words)
    end

    # Create the room
    {:ok, pid} = GenServer.start_link(
      __MODULE__,
      %{id: id, words: words, word: word}
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
  Guess what the current word is

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
  Set new word and remove the word from the list of words

  ## Example

      iex> {:ok, room} = Game.Room.new(["foo", "bar", "baz"], %{word: ""})
      ...> :ok = Game.Room.set_word(room, "bar")
      ...> Game.Room.word(room)
      "bar"

  The new word is removed from the list.

      iex> {:ok, room} = Game.Room.new(["foo", "bar", "baz"], %{word: ""})
      ...> :ok = Game.Room.set_word(room, "bar")
      ...> Game.Room.words(room)
      ["foo", "baz"]
  """
  def set_word(room, word), do: GenServer.cast(room, {:set_word, word})

  @doc """
  Return all words
  """
  def words(room), do: GenServer.call(room, :words)

  @doc """
  Return the current word
  """
  def word(room), do: GenServer.call(room, :word)

  def init(opts) do
    state = %{id: opts.id, words: opts.words, word: opts.word}
    {:ok, state}
  end

  def handle_call(:id, _, state), do: {:reply, state.id, state}

  def handle_call({:guess, word}, _, state),
    do: {:reply, Game.Logic.guess(state.word, word), state}

  def handle_call(:words, _, state), do: {:reply, state.words, state}

  def handle_call(:word, _, state), do: {:reply, state.word, state}

  def handle_cast({:set_word, word}, state) do
    state = Map.put(state, :word, word)
    state = Map.put(state, :words, List.delete(state.words, word))
    {:noreply, state}
  end
end
