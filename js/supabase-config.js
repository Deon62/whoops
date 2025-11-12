// Supabase Configuration
const SUPABASE_URL = 'https://odxdwpdmhdnokgwawymf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9keGR3cGRtaGRub2tnd2F3eW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDc0OTEsImV4cCI6MjA3ODQ4MzQ5MX0.oVDDcy3c0M4SKmHqw9HteNZPqa4Qj4jdPck3XX1y0LE';

// Initialize Supabase client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

