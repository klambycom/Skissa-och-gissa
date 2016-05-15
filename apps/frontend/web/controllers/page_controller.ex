defmodule Frontend.PageController do
  use Frontend.Web, :controller

  def index(conn, _params) do
    toplist = [
      %{name: "Christian Nilsson", score: 1000, avatar: "", position: 1},
      %{name: "Foo Bar",           score: 950,  avatar: "", position: 2},
      %{name: "Jane Doe",          score: 900,  avatar: "", position: 3},
      %{name: "Dylan Simmons",     score: 800,  avatar: "", position: 4},
      %{name: "John Doe",          score: 775,  avatar: "", position: 5}
    ]

    games = [
      %{
        name: "Allmän",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        friends: [
          %{name: "Foo Bar", avatar: ""},
          %{name: "Foo Bar", avatar: ""},
          %{name: "Foo Bar", avatar: ""}
        ],
        players: 5
      },
      %{
        name: "IT",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        friends: [
          %{name: "Foo Bar", avatar: ""}
        ],
        players: 5
      },
      %{
        name: "Sport",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        friends: [
          %{name: "Foo Bar", avatar: ""}
        ],
        players: 5
      }
    ]

    render conn, "index.html", %{toplist: toplist, games: games}
  end
end
