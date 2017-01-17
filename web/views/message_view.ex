defmodule SkissaOchGissa.MessageView do
  use SkissaOchGissa.Web, :view

  def render("message.json", message, socket),
    do: %{
          user: socket.assigns.user,
          body: message,
          timestamp: :os.system_time(:milli_seconds)
        }
end
