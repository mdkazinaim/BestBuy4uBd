import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "dist");
const htmlFilePath = path.join(distDir, "index.html");
const phpFilePath = path.join(distDir, "index.php");
// PHP Code block to inject at the top of index.php


const phpHeader = `<?php
// Prevent PHP notices/warnings from corrupting HTML response
error_reporting(0);

// Determine the protocol and host
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'];
$origin = $protocol . $host;

// Local caching directory and name based on host
$cache_file = __DIR__ . '/settings_cache_' . md5($host) . '.json';
$cache_duration = 3600; // 1 hour caching for high performance

$settings = null;

// Read settings from cache if it exists and is not expired
if (file_exists($cache_file) && (time() - filemtime($cache_file) < $cache_duration)) {
    $settings = json_decode(file_get_contents($cache_file), true);
}

// Fetch settings from API if cache is empty or expired
if (!$settings) {
    $api_url = 'https://spark-tech-server.vercel.app/api/v1/settings';
    
    // Pass the dynamic Origin/Referer headers so that the backend tenantResolver knows which DB/tenant settings to retrieve
    $options = [
        'http' => [
            'method' => 'GET',
            'header' => "Origin: " . $origin . "\r\n" .
                        "Referer: " . $origin . "/\r\n" .
                        "User-Agent: Hostinger-PHP-Metadata-Agent\r\n" .
                        "Timeout: 3\r\n"
        ]
    ];
    
    $context = stream_context_create($options);
    $response = @file_get_contents($api_url, false, $context);
    
    if ($response) {
        $api_data = json_decode($response, true);
        if (isset($api_data['data']['adminInfo'])) {
            $settings = $api_data['data']['adminInfo'];
            // Store settings in cache
            @file_put_contents($cache_file, json_encode($settings));
        }
    }
}

// Extract variables with safe, brand-appropriate fallbacks
$site_title = (isset($settings['siteName']) && !empty($settings['siteName'])) ? $settings['siteName'] : 'BestBuy4uBd';
$site_description = (isset($settings['information']) && !empty($settings['information'])) ? $settings['information'] : 'Best Buy for You in Bangladesh - Your trusted online shopping destination.';
$site_image = (isset($settings['logo']) && !empty($settings['logo'])) ? $settings['logo'] : 'https://bestbuy4ubd.com/logo.png';
?>
`;

function processHtmlToPhp() {
  try {
    if (!fs.existsSync(htmlFilePath)) {
      console.error("Error: dist/index.html does not exist. Run vite build first.");
      process.exit(1);
    }

    let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

    // Replace the placeholders with PHP variables
    htmlContent = htmlContent.replace(/\{\{SITE_TITLE\}\}/g, "<?php echo htmlspecialchars(\$site_title); ?>");
    htmlContent = htmlContent.replace(/\{\{SITE_DESCRIPTION\}\}/g, "<?php echo htmlspecialchars(\$site_description); ?>");
    htmlContent = htmlContent.replace(/\{\{SITE_IMAGE\}\}/g, "<?php echo htmlspecialchars(\$site_image); ?>");

    // Write index.php file
    fs.writeFileSync(phpFilePath, phpHeader + htmlContent, "utf8");
    console.log("Successfully created dist/index.php with server-side dynamic meta tags!");

    // Clean up dist/index.html so that the server serves index.php
    fs.unlinkSync(htmlFilePath);
    console.log("Removed dist/index.html.");

  } catch (error) {
    console.error("An error occurred during postbuild processing:", error);
    process.exit(1);
  }
}

processHtmlToPhp();
