# Binance Guard - Secure API Management

A modern, secure web application for managing Binance API keys with advanced security features and optimized performance.

## 🚀 Features

- **Secure API Key Management**: Encrypted storage and validation of Binance API keys
- **Advanced Security**: Multi-layer security with CSP, HSTS, and access control
- **Modern UI/UX**: Responsive design with smooth animations and accessibility features
- **Performance Optimized**: Lazy loading, caching, and optimized assets
- **Mobile Responsive**: Fully responsive design for all device sizes
- **Access Control**: Lockscreen protection with attempt limiting
- **Error Handling**: Robust error handling with retry mechanisms
- **SEO Optimized**: Structured data, meta tags, and sitemap

## 🛡️ Security Features

- Content Security Policy (CSP) headers
- X-Frame-Options protection
- HSTS (HTTP Strict Transport Security)
- Input validation and sanitization
- Rate limiting and access control
- Secure form handling with Netlify
- Protection against common attacks (XSS, CSRF, etc.)

## 📁 Project Structure

```
/
├── index.html          # Main application page
├── lockscreen.html     # Access control page
├── 404.html           # Custom error page
├── styles.css         # Optimized CSS with modern features
├── script.js          # Enhanced JavaScript with performance monitoring
├── netlify.toml       # Netlify configuration
├── _redirects         # URL redirects and routing
├── _headers           # Security and caching headers
├── robots.txt         # Search engine directives
├── sitemap.xml        # SEO sitemap
└── README.md          # Documentation
```

## 🚀 Deployment to Netlify

### Method 1: Git Repository (Recommended)

1. **Push to Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Binance Guard optimized"
   git branch -M main
   git remote add origin https://github.com/yourusername/binance-guard.git
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings are automatically configured via `netlify.toml`
   - Deploy!

### Method 2: Drag & Drop

1. **Create a ZIP file** of all project files
2. **Drag and drop** to Netlify dashboard
3. **Configure custom domain** (optional)

### Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir .
```

## ⚙️ Configuration

### Environment Variables

No environment variables are required for basic deployment. For production:

- Update `sitemap.xml` with your actual domain
- Update `robots.txt` with your domain
- Customize the lockscreen passcode in `lockscreen.html`

### Custom Domain

1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain
3. Configure DNS settings as instructed
4. SSL certificate will be automatically provisioned

## 🎨 Customization

### Styling

The application uses CSS custom properties (variables) for easy theming:

```css
:root {
  --primary-color: #f0b90b;
  --secondary-color: #181a20;
  --text-primary: #ffffff;
  /* ... more variables */
}
```

### Access Control

Default lockscreen passcode: `120389`

To change it, edit the `correctPasscode` variable in `lockscreen.html`:

```javascript
this.correctPasscode = 'YOUR_NEW_PASSCODE';
```

### Form Handling

The form is configured for Netlify Forms. For custom backend:

1. Update the form action in `index.html`
2. Modify the fetch URL in `script.js`
3. Update redirect rules in `netlify.toml`

## 🔧 Performance Optimizations

- **CSS**: Minified and cached with long expiry
- **JavaScript**: Optimized with debouncing and performance monitoring
- **Images**: Optimized loading with proper caching headers
- **Fonts**: Preloaded and optimized loading
- **HTTP/2**: Server push for critical resources
- **Compression**: Gzip/Brotli compression enabled
- **Caching**: Aggressive caching for static assets

## 📊 Lighthouse Scores

The application is optimized for:
- **Performance**: 95+ score
- **Accessibility**: 100 score
- **Best Practices**: 100 score
- **SEO**: 100 score

## 🔒 Security Headers

All security headers are configured in `netlify.toml` and `_headers`:

- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Strict-Transport-Security
- Permissions-Policy

## 🐛 Troubleshooting

### Common Issues

1. **Form submissions not working**:
   - Ensure Netlify Forms are enabled
   - Check the `data-netlify="true"` attribute

2. **Assets not loading**:
   - Verify all file paths are correct
   - Check network tab for 404 errors

3. **Lockscreen not working**:
   - Clear localStorage
   - Check browser console for errors

4. **CSP violations**:
   - Update CSP headers in `netlify.toml`
   - Avoid inline styles/scripts where possible

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Netlify Documentation](https://docs.netlify.com/)
- [Binance API Documentation](https://binance-docs.github.io/apidocs/)
- [Web Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)

---

**Note**: This application is for educational/demonstration purposes. Always follow security best practices when handling sensitive API keys in production environments.