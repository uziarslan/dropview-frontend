/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: 'var(--card)',
                'card-foreground': 'var(--card-foreground)',
                popover: 'var(--popover)',
                'popover-foreground': 'var(--popover-foreground)',
                primary: 'var(--primary)',
                'primary-foreground': 'var(--primary-foreground)',
                secondary: 'var(--secondary)',
                'secondary-foreground': 'var(--secondary-foreground)',
                muted: 'var(--muted)',
                'muted-foreground': 'var(--muted-foreground)',
                accent: 'var(--accent)',
                'accent-foreground': 'var(--accent-foreground)',
                destructive: 'var(--destructive)',
                'destructive-foreground': 'var(--destructive-foreground)',
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                // Sidebar tokens (optional but present in globals.css)
                sidebar: 'var(--sidebar)',
                'sidebar-foreground': 'var(--sidebar-foreground)',
                'sidebar-primary': 'var(--sidebar-primary)',
                'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
                'sidebar-accent': 'var(--sidebar-accent)',
                'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
                'sidebar-border': 'var(--sidebar-border)',
                'sidebar-ring': 'var(--sidebar-ring)'
            },
            borderRadius: {
                sm: 'calc(var(--radius) - 4px)',
                md: 'calc(var(--radius) - 2px)',
                lg: 'var(--radius)',
                xl: 'calc(var(--radius) + 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                'accordion-up': 'accordion-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
}
