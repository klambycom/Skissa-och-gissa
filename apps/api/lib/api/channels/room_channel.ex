defmodule Api.RoomChannel do
  use Api, :channel

  alias Api.Presence

  def join("room:" <> _id, _params, socket) do
    send self(), :after_join
    {:ok, socket}
  end

  #def join("room:lobby", _params, socket) do
  #  send self(), :after_join
  #  {:ok, socket}
  #end

  def join(_other, _params, socket), do: {:error, "Room does not exist."}

  def handle_info(:after_join, socket) do
    push socket, "presence_state", Presence.list(socket)
    Presence.track(socket, socket.assigns.user, %{
      online_at: :os.system_time(:milli_seconds)
    })
    {:noreply, socket}
  end

  def handle_in("message:new", message, socket) do
    broadcast! socket, "message:new", %{
      user: socket.assigns.user,
      body: message,
      timestamp: :os.system_time(:milli_seconds)
    }
    {:noreply, socket}
  end

  def handle_in("paint:point", data, socket) do
    broadcast! socket, "paint:point", data
    {:noreply, socket}
  end

  def handle_in("paint:pencil", data, socket) do
    broadcast! socket, "paint:pencil", data
    {:noreply, socket}
  end
end
