defmodule Game.Database.Difficulty do
  @moduledoc """
  Ecto type for difficulty atom.
  """

  @behaviour Ecto.Type

  def type, do: :integer

  @doc """
  Cast
  """
  def cast(value), do: {:ok, value}

  @doc """
  Load
  """
  def load(0), do: {:ok, :undecided}
  def load(1), do: {:ok, :easy}
  def load(2), do: {:ok, :medium}
  def load(3), do: {:ok, :hard}

  @doc """
  Dump
  """
  def dump(:undecided), do: {:ok, 0}
  def dump(:easy),      do: {:ok, 1}
  def dump(:medium),    do: {:ok, 2}
  def dump(:hard),      do: {:ok, 3}
  def dump(_), do: :error
end
