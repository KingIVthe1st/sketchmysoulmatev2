#!/bin/bash

echo "🔧 Setting up Render MCP Server Integration"
echo "=========================================="

echo ""
echo "STEP 1: Get your Render API Key"
echo "1. Go to: https://dashboard.render.com/account"
echo "2. Navigate to 'API Keys' section"
echo "3. Click 'Create New API Key'"
echo "4. Name it: 'Claude Code Integration'"
echo "5. Copy the generated key"
echo ""

echo "STEP 2: Configure MCP Server"
echo "Once you have your API key, run:"
echo ""
echo "claude mcp add --transport http render https://mcp.render.com/mcp --header \"Authorization: Bearer <YOUR_API_KEY>\""
echo ""
echo "Replace <YOUR_API_KEY> with your actual API key"
echo ""

echo "STEP 3: Test Integration"
echo "After setup, I'll be able to:"
echo "✅ List your Render services"
echo "✅ Create new services directly"
echo "✅ Manage deployments"
echo "✅ Query service status"
echo "✅ Delete problematic services"
echo ""

echo "🎯 This will bypass the Render CLI issues and give me direct API access!"