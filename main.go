package main

import (
	"log"
	"os"
	"sls-report-app/middleware"
	"sls-report-app/render"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/csrf"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/template/html/v2"
	"github.com/gofiber/utils"
	"github.com/joho/godotenv"
)

// const basepath = "https://sls-report-api.945.report"
// const basepath = "http://127.0.0.1:4444"

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	basepath := os.Getenv("BASEPATH")
	if basepath == "" {
		log.Fatal("BASEPATH is not set in the environment")
	}

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

	app.Use(middleware.Basepath(basepath))

	app.Static("/", "./static/public")

	app.Get("/", render.HomePage)
	app.Get("/login", render.LoginPage)
	app.Get("/ads", render.AdsPage)
	app.Get("/ads-form", render.AdsFormPage)
	app.Get("/campaign-form-old", render.CampaignFormOldPage)
	app.Get("/campaign-form", render.CampaignFormPage)
	app.Get("/chat", render.ChatPage)
	// app.Post("/get-pokemon", handlers.GetPokemonApiHandler)
	app.Get("/dashboard", render.DashboardNewPage)
	// app.Get("/dashboard-new", render.DashboardPage)
	app.Get("/key-order", render.KeyOrderPage)
	app.Get("/negativ-review", render.NegativeReviewPage)
	app.Get("/video", render.ImportVideoPage)
	app.Get("/product-order", render.ProductOrderwPage)
	app.Get("/key-clip", render.KeyClipPage)
	app.Get("/negative-details", render.NegativeDetailsPage)
	app.Get("/key-ads", render.AdsKeyAddPage)
	app.Get("/details-add", render.DetailsAddPage)
	app.Get("/ads-tiktok", render.AdsTiktokPage)
	app.Get("/tiktok-live", render.TiktokLivePage)
	app.Get("/tiktok-form", render.TiktokFormPage)
	app.Get("/fb-form", render.FacebookFormPage)
	app.Get("/report-tiktoklive", render.ReportTiktokLivePage)

	app.Listen(":8000")

}
