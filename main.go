package main

import (
	"mai/handlers"
	"mai/render"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/csrf"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/template/html/v2"
	"github.com/gofiber/utils"
)

func main() {
	engine := html.New("./views", ".html")
	app := fiber.New(fiber.Config{
		Views: engine,
	})
	app.Use(logger.New())

	app.Use(csrf.New(csrf.Config{
		KeyLookup:      "header:X-Csrf-Token",
		CookieName:     "csrf_",
		CookieSameSite: "Lax",
		Expiration:     1 * time.Hour,
		KeyGenerator:   utils.UUID,
	}))

	app.Static("/", "./static/public")

	app.Get("/", render.HomePage)
	app.Get("/login", render.LoginPage)
	app.Get("/ads", render.AdsPage)
	app.Get("/chat", render.ChatPage)
	app.Post("/get-pokemon", handlers.GetPokemonApiHandler)
	app.Get("/dashboard", render.DashboardPage)
	app.Get("/dashboard-new", render.DashboardNewPage)
	app.Get("/key-order", render.KeyOrderPage)
	app.Get("/negativ-review", render.NegativeReviewPage)
	app.Get("/video", render.ImportVideoPage)
	app.Get("/product-order", render.ProductOrderwPage)
	app.Get("/key-clip", render.KeyClipPage)
	app.Listen(":8000")

}
