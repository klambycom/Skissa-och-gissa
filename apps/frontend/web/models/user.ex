defmodule Frontend.User do
  use Frontend.Web, :model

  schema "users" do
    field :name, :string
    field :email, :string
    field :score, :integer, default: 0
    field :password_digest, :string
    field :password, :string, virtual: true

    timestamps
  end

  @required_fields ~w(name email password)
  @optional_fields ~w()

  @doc """
  Create user and hash the password
  """
  def changeset(model, params \\ :invalid) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> put_pass_hash
  end

  @doc """
  Find user by email
  """
  def find_by_email(email) do
    from a in __MODULE__,
    where: a.email == ^email
  end

  defp put_pass_hash(changeset) do
    #IEx.pry
    if Map.has_key?(changeset.changes, :password) do
      password = changeset.changes.password
      put_change(changeset, :password_digest, Comeonin.Bcrypt.hashpwsalt(password))
    else
      changeset
    end
  end
end
