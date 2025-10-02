# Requirements Document

## Introduction

This feature integrates the existing backend Stock Data Proxy API with the React Native client application. The integration will connect stock market data endpoints to display real-time information across multiple screens including stocks listing, news feed, market exploration, and stock spotlight functionality.

## Requirements

### Requirement 1

**User Story:** As a mobile app user, I want to view categorized stock lists (top gainers, top losers, most active) so that I can quickly identify market trends and opportunities.

#### Acceptance Criteria

1. WHEN the user navigates to the stocks tab THEN the system SHALL display three categories: "Top Gainers", "Top Losers", and "Most Active"
2. WHEN the user selects a category THEN the system SHALL fetch data from the corresponding backend endpoint (/gainers, /losers, /active)
3. WHEN the API call is successful THEN the system SHALL display stock information including symbol, name, price, change, and change percentage
4. WHEN the API call fails THEN the system SHALL display an appropriate error message to the user
5. WHEN stock data is loading THEN the system SHALL show a loading indicator

### Requirement 2

**User Story:** As a mobile app user, I want to read the latest financial news so that I can stay informed about market developments.

#### Acceptance Criteria

1. WHEN the user navigates to the news tab THEN the system SHALL fetch and display financial news from the /news endpoint
2. WHEN news is displayed THEN each item SHALL show title, summary, source, and publication date
3. WHEN the user taps on a news item THEN the system SHALL open the full article in a web browser
4. WHEN the API call fails THEN the system SHALL display an appropriate error message
5. WHEN news data is loading THEN the system SHALL show a loading indicator

### Requirement 3

**User Story:** As a mobile app user, I want to see top news headlines on the explore page so that I can quickly catch up on important market news without navigating to a separate news tab.

#### Acceptance Criteria

1. WHEN the user views the explore page THEN the system SHALL display the top 5 news items in the NewsSection component
2. WHEN news items are displayed THEN they SHALL show title and summary
3. WHEN the user taps on a news item THEN the system SHALL open the full article
4. WHEN news fails to load THEN the system SHALL gracefully handle the error without breaking the explore page
5. WHEN news is loading THEN the system SHALL show a subtle loading state

### Requirement 4

**User Story:** As a mobile app user, I want to see detailed information about a featured stock on the explore page so that I can learn about investment opportunities.

#### Acceptance Criteria

1. WHEN the explore page loads THEN the system SHALL randomly select a stock from ["NVDA", "TSLA", "AMD", "AAPL", "GOOGL"]
2. WHEN a stock is selected THEN the system SHALL fetch detailed information from the /spotlight endpoint
3. WHEN spotlight data is received THEN the system SHALL display company name, symbol, description, current price, price change, and percentage change
4. WHEN the spotlight API fails THEN the system SHALL display fallback data or an error state
5. WHEN spotlight data is loading THEN the system SHALL show a loading indicator

### Requirement 5

**User Story:** As a mobile app user, I want the app to handle network errors gracefully so that I have a smooth experience even when connectivity is poor.

#### Acceptance Criteria

1. WHEN any API call fails due to network issues THEN the system SHALL display user-friendly error messages
2. WHEN the backend is unavailable THEN the system SHALL provide retry functionality
3. WHEN data is stale THEN the system SHALL indicate the last update time
4. WHEN the user pulls to refresh THEN the system SHALL attempt to fetch fresh data
5. WHEN offline THEN the system SHALL display cached data if available or an offline message

### Requirement 6

**User Story:** As a mobile app user, I want consistent data formatting across all screens so that information is easy to understand and compare.

#### Acceptance Criteria

1. WHEN displaying stock prices THEN the system SHALL format them to 2 decimal places with currency symbol
2. WHEN displaying percentage changes THEN the system SHALL show + or - prefix and use appropriate colors (green for positive, red for negative)
3. WHEN displaying large numbers THEN the system SHALL use appropriate abbreviations (K, M, B)
4. WHEN displaying dates THEN the system SHALL use consistent relative time formatting
5. WHEN displaying company names THEN the system SHALL handle long names with appropriate truncation