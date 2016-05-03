defmodule Game.Server do
  use GenServer

  @moduledoc """
  The server handles the game and its players.
  """

  @doc """
  Get the id of the server

  ## Example

      iex> state = Game.State.new("Game", "", ["foo", "bar", "baz"])
      ...> {:ok, server} = Game.Server.start_link(state)
      ...> Game.Server.id(server) != nil
      true
  """
  def id(server), do: GenServer.call(server, :id)

  @doc """
  Guess what the current word is. A new round will start if the guess is
  correct, and a new word will be selected.

  ## Example

      iex> state = Game.State.new("Game", "", ["foo", "bar", "baz"])
      ...> {:ok, pid} = Game.Server.start_link(state)
      ...> Game.Server.guess(pid, "wrong")
      false

      iex> state = Game.State.new("Game", "", ["foo", "bar", "baz"])
      ...> {:ok, pid} = Game.Server.start_link(state)
      ...> Game.Server.guess(pid, Game.Server.word(pid))
      true
  """
  def guess(server, word), do: GenServer.call(server, {:guess, word})

  @doc """
  Return all words
  """
  def words(server), do: GenServer.call(server, :words)

  @doc """
  Return the current word
  """
  def word(server), do: GenServer.call(server, :word)

  @doc """
  Return number of rounds left
  """
  def rounds(server), do: GenServer.call(server, :rounds)

  ###
  # GenServer API
  ###

  @doc false
  def start_link(state), do: GenServer.start_link(__MODULE__, state)

  def init(state), do: {:ok, state}

  def handle_call(:id, _, state), do: {:reply, state.id, state}

  def handle_call({:guess, word}, _, state) do
    if Game.Word.compare(word, state.word) do
      {:reply, true, Game.State.new_word(state)}
    else
      {:reply, false, state}
    end
  end

  def handle_call(:words, _, state), do: {:reply, state.words, state}

  def handle_call(:word, _, state), do: {:reply, state.word, state}

  def handle_call(:rounds, _, state), do: {:reply, state.rounds_left, state}
end
