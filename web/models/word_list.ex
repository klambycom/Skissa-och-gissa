defmodule SkissaOchGissa.WordList do
  @behaviour Ecto.Type

  def type, do: {:array, :string}

  def cast(string) when is_binary(string),
    do: {:ok, String.split(string, ",", trim: true)}

  def cast(list) when is_list(list), do: {:ok, list}
  def cast(_), do: :error

  def load(list) when is_list(list), do: {:ok, list}
  def load(_), do: :error

  def dump(list) when is_list(list), do: {:ok, list}
  def dump(_), do: :error
end
