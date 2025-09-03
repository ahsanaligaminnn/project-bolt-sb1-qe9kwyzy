#!/usr/bin/env python3
"""
QuotexApi Setup Script
Downloads and installs the QuotexApi library
"""

import os
import subprocess
import sys

def run_command(command):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {command}")
            return True
        else:
            print(f"❌ {command}")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error running command: {e}")
        return False

def main():
    print("🚀 Setting up QuotexApi Trading Dashboard...")
    print("=" * 50)
    
    # Check if git is available
    if not run_command("git --version"):
        print("❌ Git is not installed. Please install Git first.")
        return False
    
    # Clone QuotexApi repository
    print("\n📥 Downloading QuotexApi library...")
    if os.path.exists("QuotexApi"):
        print("QuotexApi directory already exists. Updating...")
        os.chdir("QuotexApi")
        run_command("git pull")
        os.chdir("..")
    else:
        if not run_command("git clone https://github.com/ahsanaligaminnn/QuotexApi"):
            return False
    
    # Install Python requirements
    print("\n📦 Installing Python requirements...")
    if not run_command("pip install flask flask-cors requests websockets aiohttp"):
        print("❌ Failed to install basic requirements")
        return False
    
    # Install QuotexApi requirements
    if os.path.exists("QuotexApi/requirements.txt"):
        if not run_command("pip install -r QuotexApi/requirements.txt"):
            print("❌ Failed to install QuotexApi requirements")
            return False
    
    # Install additional requirements
    if os.path.exists("requirements.txt"):
        if not run_command("pip install -r requirements.txt"):
            print("❌ Failed to install additional requirements")
            return False
    
    print("\n✅ Setup completed successfully!")
    print("\n🎯 Next steps:")
    print("1. Run: python api_server.py")
    print("2. Open the web dashboard")
    print("3. Enter your Quotex credentials")
    print("4. Start monitoring for real signals!")
    print("\n⚠️  Important: Make sure you have a valid Quotex account")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)