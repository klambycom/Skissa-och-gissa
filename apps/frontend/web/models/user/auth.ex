defmodule Frontend.User.Auth do
  @doc """
  Authenticate the user with password.
  """

  alias Frontend.{Repo, User}
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

  @doc """
  Find user by email and verify that the password is correct.
  """
  def verify(email, password) do
    account = Repo.one(User.find_by_email(email))

    cond do
      account && checkpw(password, account.password_digest) ->
        {:ok, account}
      account ->
        {:error, :bad_password}
      true ->
        dummy_checkpw
        {:error, :not_found}
    end
  end
end
