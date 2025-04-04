# Email Generation Test Prompts

This document contains various test prompts for the AI email template generator. Each prompt is designed to test different aspects of the generation system.

## Test Cases

### 1. Tech Startup Marketing
```yaml
Email About: "Launch of our new AI-powered productivity app that helps professionals manage their time better and increase workplace efficiency"
Business Type: "Technology Startup"
Target Audience: "Busy professionals and knowledge workers aged 25-45"
Style: "Informative"
Expected Outcome: Technical, feature-focused email with clear value propositions
```

### 2. Fitness Studio Promotion
```yaml
Email About: "New year fitness challenge - 30-day transformation program with personalized workout plans and nutrition guidance for achieving your health goals"
Business Type: "Fitness and Wellness Studio"
Target Audience: "Health-conscious individuals looking to start their fitness journey"
Style: "Inspirational"
Expected Outcome: Motivational content with strong call-to-action
```

### 3. Educational Workshop
```yaml
Email About: "Upcoming virtual workshop series on digital marketing fundamentals, covering SEO, social media strategy, and content marketing over 6 weekly sessions"
Business Type: "Education and Training"
Target Audience: "Small business owners and marketing professionals"
Style: "Formal"
Expected Outcome: Professional, structured content with clear learning objectives
```

### 4. E-commerce Sale
```yaml
Email About: "End of season clearance sale - Up to 70% off on premium fashion brands, including exclusive designer collections and limited edition pieces"
Business Type: "Online Fashion Retail"
Target Audience: "Fashion-conscious shoppers aged 18-35"
Style: "Assertive"
Expected Outcome: Dynamic, action-oriented content with urgency
```

### 5. Restaurant Newsletter
```yaml
Email About: "Introducing our new seasonal menu featuring farm-to-table ingredients, chef's special dishes, and exclusive wine pairings for an unforgettable dining experience"
Business Type: "Fine Dining Restaurant"
Target Audience: "Food enthusiasts and regular diners"
Style: "Neutral"
Expected Outcome: Balanced, descriptive content with subtle promotion
```

### 6. Community Event
```yaml
Email About: "Join us for our annual neighborhood festival featuring local artists, food vendors, live music performances, and family-friendly activities"
Business Type: "Community Organization"
Target Audience: "Local residents and families"
Style: "Informal"
Expected Outcome: Friendly, welcoming tone with community focus
```

## Testing Guidelines

### Word Count Testing
- Test near the 150-word limit
- Test very short descriptions (10-20 words)
- Test with exactly 150 words

### Style Combinations
Test each style with different business types:
- Inspirational + Professional Services
- Formal + Creative Business
- Informal + Corporate
- Assertive + Non-profit
- Neutral + Technical Services

### Content Variations
Test with:
- Special characters (!@#$%^&*)
- Multiple paragraphs
- Lists and bullet points
- Numbers and statistics
- Dates and times
- Pricing information
- Links and URLs

### Target Audience Variations
Test with:
- Age ranges
- Professional roles
- Interest groups
- Geographic locations
- Income levels
- Industry-specific audiences

## Edge Cases

### 1. Maximum Length
```yaml
Email About: "Comprehensive digital transformation initiative focusing on implementing cutting-edge artificial intelligence solutions, machine learning algorithms, and automated workflow processes to revolutionize business operations, enhance customer experience, optimize resource allocation, and drive data-driven decision making across all organizational levels while ensuring scalability and future-proof architecture..."
Business Type: "Technology Consulting"
Target Audience: "Enterprise-level decision makers"
Style: "Formal"
```

### 2. Special Characters
```yaml
Email About: "50% OFF! 🎉 HUGE SALE!!! Don't miss out on these amazing deals! #BlackFriday @YourStore"
Business Type: "Retail"
Target Audience: "Bargain hunters & deal seekers!"
Style: "Assertive"
```

### 3. Minimal Input
```yaml
Email About: "Quick sale announcement"
Business Type: "Shop"
Target Audience: "Customers"
Style: "Neutral"
```

## Best Practices for Testing

1. **Systematic Approach**
   - Test one variable at a time
   - Document unexpected behaviors
   - Test all style combinations

2. **Content Validation**
   - Check for proper formatting
   - Verify style consistency
   - Review call-to-action placement
   - Check responsive design

3. **Error Handling**
   - Test with empty fields
   - Test with invalid characters
   - Test with extremely long inputs
   - Test with duplicate content

4. **Performance Testing**
   - Test multiple generations
   - Check generation speed
   - Verify template loading
   - Test preview functionality

## Notes

- All test cases should be run in both light and dark modes
- Test across different devices and screen sizes
- Verify email client compatibility
- Check for proper HTML generation
- Validate accessibility features 
