defmodule SkissaOchGissa.Repo.Migrations.CreateAuthentication.Email do
  use Ecto.Migration

  def change do
    create table(:email_authentications) do
      add :email, :string, null: false
      add :password_hash, :string

      timestamps()
    end

    create unique_index(:email_authentications, [:email])
  end
end
