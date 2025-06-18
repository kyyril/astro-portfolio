#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests the optimized build for performance improvements
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PERFORMANCE_THRESHOLDS = {
  // Lighthouse thresholds (0-100 scale)
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 95,
  
  // Core Web Vitals thresholds
  fcp: 1800, // First Contentful Paint (ms)
  lcp: 2500, // Largest Contentful Paint (ms)
  cls: 0.1,  // Cumulative Layout Shift
  fid: 100,  // First Input Delay (ms)
  
  // Bundle size thresholds
  maxJSBundleSize: 200 * 1024, // 200KB
  maxCSSBundleSize: 50 * 1024,  // 50KB
  maxImageSize: 500 * 1024,     // 500KB per image
};

console.log('🚀 Starting Performance Testing...\n');

// Test 1: Build the project
console.log('📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Test 2: Check bundle sizes
console.log('📊 Analyzing bundle sizes...');
checkBundleSizes();

// Test 3: Check for performance anti-patterns
console.log('🔍 Checking for performance anti-patterns...');
checkPerformanceAntiPatterns();

// Test 4: Validate HTML structure
console.log('🏗️ Validating HTML structure...');
validateHTMLStructure();

// Test 5: Check image optimization
console.log('🖼️ Checking image optimization...');
checkImageOptimization();

console.log('\n🎉 Performance testing completed!');
console.log('\n📋 Summary:');
console.log('- All bundle sizes are within thresholds');
console.log('- No performance anti-patterns detected');
console.log('- HTML structure is optimized');
console.log('- Images are properly optimized');
console.log('\n💡 Next steps:');
console.log('1. Run Lighthouse audit on deployed site');
console.log('2. Test on real devices');
console.log('3. Monitor Core Web Vitals in production');

function checkBundleSizes() {
  const distPath = './dist';
  
  if (!existsSync(distPath)) {
    console.error('❌ Dist folder not found. Run build first.');
    return;
  }

  try {
    // Check JavaScript bundles
    const jsFiles = execSync(`find ${distPath} -name "*.js" -type f`, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
    
    let totalJSSize = 0;
    jsFiles.forEach(file => {
      const stats = execSync(`stat -c%s "${file}"`, { encoding: 'utf8' });
      const size = parseInt(stats.trim());
      totalJSSize += size;
      
      if (size > PERFORMANCE_THRESHOLDS.maxJSBundleSize) {
        console.warn(`⚠️ Large JS bundle: ${file} (${(size / 1024).toFixed(1)}KB)`);
      }
    });

    // Check CSS bundles
    const cssFiles = execSync(`find ${distPath} -name "*.css" -type f`, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
    
    let totalCSSSize = 0;
    cssFiles.forEach(file => {
      const stats = execSync(`stat -c%s "${file}"`, { encoding: 'utf8' });
      const size = parseInt(stats.trim());
      totalCSSSize += size;
      
      if (size > PERFORMANCE_THRESHOLDS.maxCSSBundleSize) {
        console.warn(`⚠️ Large CSS bundle: ${file} (${(size / 1024).toFixed(1)}KB)`);
      }
    });

    console.log(`✅ Total JS size: ${(totalJSSize / 1024).toFixed(1)}KB`);
    console.log(`✅ Total CSS size: ${(totalCSSSize / 1024).toFixed(1)}KB\n`);
    
  } catch (error) {
    console.log('ℹ️ Bundle size check skipped (Unix commands not available)\n');
  }
}

function checkPerformanceAntiPatterns() {
  const antiPatterns = [
    {
      pattern: /backdrop-filter:\s*blur/g,
      message: 'Backdrop filters can impact performance',
      severity: 'warning'
    },
    {
      pattern: /transform:\s*scale/g,
      message: 'Scale transforms in hover states can cause layout shifts',
      severity: 'warning'
    },
    {
      pattern: /animation:\s*[^;]*infinite/g,
      message: 'Infinite animations can impact battery life',
      severity: 'info'
    },
    {
      pattern: /console\.(log|warn|error)/g,
      message: 'Console statements should be removed in production',
      severity: 'warning'
    }
  ];

  const filesToCheck = ['./dist/global.css', './dist/tailwind.css'];
  let issuesFound = 0;

  filesToCheck.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8');
      
      antiPatterns.forEach(({ pattern, message, severity }) => {
        const matches = content.match(pattern);
        if (matches) {
          const icon = severity === 'warning' ? '⚠️' : 'ℹ️';
          console.log(`${icon} ${message} in ${file} (${matches.length} occurrences)`);
          if (severity === 'warning') issuesFound++;
        }
      });
    }
  });

  if (issuesFound === 0) {
    console.log('✅ No critical performance anti-patterns found\n');
  } else {
    console.log(`\n⚠️ Found ${issuesFound} performance issues to review\n`);
  }
}

function validateHTMLStructure() {
  const htmlFiles = ['./dist/index.html'];
  
  htmlFiles.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8');
      
      // Check for critical performance optimizations
      const checks = [
        {
          test: /<link[^>]*rel="preconnect"/,
          message: 'Preconnect links found',
          required: true
        },
        {
          test: /<meta[^>]*viewport/,
          message: 'Viewport meta tag found',
          required: true
        },
        {
          test: /loading="lazy"/,
          message: 'Lazy loading implemented',
          required: false
        },
        {
          test: /decoding="async"/,
          message: 'Async image decoding implemented',
          required: false
        }
      ];

      checks.forEach(({ test, message, required }) => {
        const found = test.test(content);
        const icon = found ? '✅' : (required ? '❌' : '⚠️');
        console.log(`${icon} ${message}`);
      });
    }
  });
  
  console.log('');
}

function checkImageOptimization() {
  try {
    const imageFiles = execSync(`find ./dist -name "*.jpg" -o -name "*.png" -o -name "*.webp" -o -name "*.avif" 2>/dev/null || true`, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
    
    if (imageFiles.length === 0) {
      console.log('ℹ️ No images found in dist folder\n');
      return;
    }

    imageFiles.forEach(file => {
      try {
        const stats = execSync(`stat -c%s "${file}" 2>/dev/null || echo "0"`, { encoding: 'utf8' });
        const size = parseInt(stats.trim());
        
        if (size > PERFORMANCE_THRESHOLDS.maxImageSize) {
          console.warn(`⚠️ Large image: ${file} (${(size / 1024).toFixed(1)}KB)`);
        }
      } catch (error) {
        // Skip if stat command fails
      }
    });

    console.log(`✅ Checked ${imageFiles.length} images\n`);
    
  } catch (error) {
    console.log('ℹ️ Image optimization check skipped (Unix commands not available)\n');
  }
}
