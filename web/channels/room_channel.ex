defmodule SkissaOchGissa.RoomChannel do
  use SkissaOchGissa.Web, :channel

  alias SkissaOchGissa.Presence
  alias SkissaOchGissa.{Game, MessageView}

  def join("room:" <> id, _params, socket) do
    case Repo.get(Game, id) do
      nil ->
        {:error, "Room does not exist."}
      game ->
        send self(), :after_join
        {:ok, assign(socket, :game, game)}
    end
  end

  def join(_other, _params, _socket) do
    {:error, "Room does not exist."}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", Presence.list(socket)
    Presence.track(socket, socket.assigns.user, %{
      online_at: :os.system_time(:milli_seconds)
    })
    {:noreply, socket}
  end

  def handle_in("message:new", message, socket) do
    broadcast! socket, "message:new", MessageView.render("message.json", message, socket)
    {:noreply, socket}
  end
end
