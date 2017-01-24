defmodule SkissaOchGissa.Repo.Migrations.DropAuthenticationEmails do
  use Ecto.Migration

  def change do
    drop table(:email_authentications)
  end
end
