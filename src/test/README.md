# Testing Infrastructure

This directory contains comprehensive testing infrastructure for the Astro.js portfolio project.

## Test Structure

```
src/test/
├── components/           # Unit tests for Astro components
│   ├── ScrollOptimizer.test.ts
│   └── AccessibilityEnhancer.test.ts
├── e2e/                 # End-to-end tests with Playwright
│   ├── scroll-behavior.spec.ts
│   └── accessibility.spec.ts
├── performance/         # Performance benchmarks
│   └── scroll.bench.ts
├── setup.ts            # Test setup and mocks
└── README.md           # This file
```

## Available Test Commands

### Unit Tests (Vitest)
```bash
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:ui           # Run tests with UI
npm run test:coverage     # Run tests with coverage report
npm run test:bench        # Run performance benchmarks
```

### End-to-End Tests (Playwright)
```bash
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:e2e:headed   # Run E2E tests in headed mode
```

### All Tests
```bash
npm run test:all          # Run both unit and E2E tests
```

## Test Coverage

### ScrollOptimizer Component
- ✅ Smooth scrolling functionality
- ✅ Performance monitoring (FPS tracking)
- ✅ Mobile device detection
- ✅ Reduced motion preferences
- ✅ Scroll event handling
- ✅ Keyboard navigation
- ✅ Cleanup on page transitions

### AccessibilityEnhancer Component
- ✅ Skip links creation
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Accessibility preferences
- ✅ Cleanup functionality

### End-to-End Tests
- ✅ Scroll behavior validation
- ✅ Performance monitoring UI
- ✅ Accessibility features
- ✅ Mobile responsiveness
- ✅ Cross-browser compatibility

## Performance Benchmarks

The performance benchmarks test:
- Smooth scroll calculations
- Scroll velocity tracking
- FPS monitoring overhead
- Event throttling efficiency
- DOM manipulation performance
- Memory cleanup effectiveness

## Test Environment

- **Unit Tests**: Happy DOM environment with Vitest
- **E2E Tests**: Real browsers with Playwright
- **Mocking**: Comprehensive mocks for browser APIs
- **Coverage**: V8 coverage provider with HTML reports

## Browser Support

E2E tests run on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## Accessibility Testing

Comprehensive accessibility testing includes:
- Skip links functionality
- ARIA attributes validation
- Keyboard navigation
- Focus management
- Screen reader compatibility
- Color contrast verification
- Touch target sizing (mobile)

## Performance Testing

Performance tests validate:
- 60+ FPS during scrolling
- Memory usage optimization
- Event handling efficiency
- Animation smoothness
- Core Web Vitals metrics

## CI/CD Integration

Tests are configured for:
- Automatic retries on failure
- Parallel execution
- Multiple output formats (HTML, JSON, JUnit)
- Screenshot/video capture on failure
- Coverage reporting

## Writing New Tests

### Unit Tests
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Component Name', () => {
  it('should do something', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test('should behave correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('selector')).toBeVisible();
});
```

### Performance Benchmarks
```typescript
import { bench } from 'vitest';

bench('operation name', () => {
  // Performance-critical code to benchmark
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up after tests
3. **Mocking**: Mock external dependencies
4. **Assertions**: Use descriptive assertions
5. **Performance**: Keep tests fast and efficient
6. **Accessibility**: Test with real assistive technologies
7. **Cross-browser**: Test on multiple browsers
8. **Mobile**: Include mobile-specific tests

## Troubleshooting

### Common Issues

1. **Timer Issues**: Use `vi.useFakeTimers()` for time-dependent tests
2. **DOM Cleanup**: Ensure proper cleanup in `afterEach`
3. **Async Operations**: Use proper async/await patterns
4. **Memory Leaks**: Monitor memory usage in benchmarks
5. **Flaky Tests**: Add proper waits and retries

### Debug Commands

```bash
# Debug unit tests
npm run test:ui

# Debug E2E tests
npm run test:e2e:headed

# Generate coverage report
npm run test:coverage
```

## Contributing

When adding new features:
1. Write unit tests for components
2. Add E2E tests for user interactions
3. Include accessibility tests
4. Add performance benchmarks if needed
5. Update this documentation
