#!/usr/bin/env node

/**
 * Mobile Performance Testing Script
 * Tests mobile-specific optimizations and performance
 */

import { readFileSync, existsSync } from 'fs';

console.log('📱 Starting Mobile Performance Testing...\n');

// Test 1: Check mobile-specific CSS optimizations
console.log('📱 Checking mobile CSS optimizations...');
checkMobileCSSOptimizations();

// Test 2: Check touch optimizations
console.log('👆 Checking touch optimizations...');
checkTouchOptimizations();

// Test 3: Check viewport and responsive design
console.log('📐 Checking responsive design optimizations...');
checkResponsiveOptimizations();

// Test 4: Check mobile performance features
console.log('⚡ Checking mobile performance features...');
checkMobilePerformanceFeatures();

console.log('\n🎉 Mobile performance testing completed!');

function checkMobileCSSOptimizations() {
  const cssFiles = ['./public/global.css', './dist/global.css'];
  let optimizationsFound = 0;

  const mobileOptimizations = [
    {
      pattern: /@media\s*\([^)]*max-width:\s*768px\)/g,
      message: 'Mobile breakpoints defined',
      points: 1
    },
    {
      pattern: /overscroll-behavior:\s*none/g,
      message: 'Overscroll behavior optimized',
      points: 2
    },
    {
      pattern: /-webkit-overflow-scrolling:\s*touch/g,
      message: 'iOS momentum scrolling enabled',
      points: 1
    },
    {
      pattern: /touch-action:\s*pan-y/g,
      message: 'Touch actions optimized',
      points: 2
    },
    {
      pattern: /backdrop-filter:\s*blur\([^)]*\)/g,
      message: 'Backdrop filters (performance impact)',
      points: -2,
      negative: true
    }
  ];

  cssFiles.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8');
      
      mobileOptimizations.forEach(({ pattern, message, points, negative }) => {
        const matches = content.match(pattern);
        if (matches) {
          const icon = negative ? '⚠️' : '✅';
          console.log(`${icon} ${message} (${matches.length} occurrences)`);
          optimizationsFound += points;
        }
      });
    }
  });

  const score = Math.max(0, Math.min(10, optimizationsFound));
  console.log(`📊 Mobile CSS Score: ${score}/10\n`);
}

function checkTouchOptimizations() {
  const htmlFiles = ['./dist/index.html'];
  let touchOptimizations = 0;

  htmlFiles.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8');
      
      const touchChecks = [
        {
          test: /touch-action/,
          message: 'Touch action properties used',
          points: 2
        },
        {
          test: /user-select:\s*none/,
          message: 'Text selection controlled',
          points: 1
        },
        {
          test: /-webkit-tap-highlight-color/,
          message: 'Tap highlight customized',
          points: 1
        }
      ];

      touchChecks.forEach(({ test, message, points }) => {
        if (test.test(content)) {
          console.log(`✅ ${message}`);
          touchOptimizations += points;
        }
      });
    }
  });

  if (touchOptimizations === 0) {
    console.log('ℹ️ Consider adding touch optimizations for better mobile UX');
  }
  
  console.log(`📊 Touch Optimization Score: ${touchOptimizations}/4\n`);
}

function checkResponsiveOptimizations() {
  const cssFiles = ['./public/global.css', './dist/global.css'];
  let responsiveFeatures = 0;

  const responsiveChecks = [
    {
      pattern: /@media\s*\([^)]*min-width/g,
      message: 'Mobile-first responsive design',
      points: 2
    },
    {
      pattern: /clamp\(/g,
      message: 'Fluid typography with clamp()',
      points: 2
    },
    {
      pattern: /vw|vh|vmin|vmax/g,
      message: 'Viewport units used',
      points: 1
    },
    {
      pattern: /grid-template-columns:\s*repeat\(auto-fit/g,
      message: 'Responsive grid layouts',
      points: 2
    },
    {
      pattern: /flex-wrap:\s*wrap/g,
      message: 'Flexible wrapping layouts',
      points: 1
    }
  ];

  cssFiles.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8');
      
      responsiveChecks.forEach(({ pattern, message, points }) => {
        const matches = content.match(pattern);
        if (matches) {
          console.log(`✅ ${message} (${matches.length} uses)`);
          responsiveFeatures += points;
        }
      });
    }
  });

  console.log(`📊 Responsive Design Score: ${Math.min(responsiveFeatures, 8)}/8\n`);
}

function checkMobilePerformanceFeatures() {
  const htmlFiles = ['./dist/index.html'];
  let performanceFeatures = 0;

  htmlFiles.forEach(file => {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8');
      
      const performanceChecks = [
        {
          test: /<meta[^>]*viewport[^>]*width=device-width/,
          message: 'Proper viewport meta tag',
          points: 2,
          required: true
        },
        {
          test: /loading="lazy"/g,
          message: 'Lazy loading implemented',
          points: 2
        },
        {
          test: /decoding="async"/g,
          message: 'Async image decoding',
          points: 1
        },
        {
          test: /fetchpriority="high"/g,
          message: 'Priority hints used',
          points: 1
        },
        {
          test: /<link[^>]*rel="preconnect"/g,
          message: 'Resource preconnection',
          points: 2
        },
        {
          test: /sizes="[^"]*vw/g,
          message: 'Responsive image sizes',
          points: 2
        }
      ];

      performanceChecks.forEach(({ test, message, points, required }) => {
        const matches = content.match(test);
        if (matches) {
          console.log(`✅ ${message} (${matches.length} uses)`);
          performanceFeatures += points;
        } else if (required) {
          console.log(`❌ Missing: ${message}`);
        }
      });
    }
  });

  console.log(`📊 Mobile Performance Score: ${Math.min(performanceFeatures, 10)}/10\n`);
}

// Mobile Performance Recommendations
console.log('💡 Mobile Performance Recommendations:');
console.log('1. Test on real devices with throttled networks');
console.log('2. Use Chrome DevTools mobile simulation');
console.log('3. Monitor Core Web Vitals on mobile');
console.log('4. Consider service worker for offline functionality');
console.log('5. Optimize for touch interactions and gestures');
console.log('6. Test with various screen sizes and orientations\n');
