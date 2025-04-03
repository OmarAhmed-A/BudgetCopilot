import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Card, Chip, Button, Divider, Modal, Portal, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

// Define TypeScript interfaces
interface AIResponse {
  title: string;
  content: string;
  recommendations: string[];
}

interface Investment {
  name: string;
  ticker: string;
  allocation: number;
  value: number;
  change: number;
  type: string;
  risk: string;
}

interface Recommendation {
  name: string;
  ticker: string;
  expected: number;
  risk: string;
  type: string;
  description: string;
}

export default function InvestmentAdvisor() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const screenWidth = Dimensions.get("window").width;
  
  const [selectedTab, setSelectedTab] = useState("portfolio");
  const [modalVisible, setModalVisible] = useState(false);
  const [queryModalVisible, setQueryModalVisible] = useState(false);
  const [investmentQuery, setInvestmentQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  
  // Mock portfolio data
  const portfolioData: Investment[] = [
    {
      name: "Tech Growth ETF",
      ticker: "TECH",
      allocation: 25,
      value: 812.45,
      change: 3.2,
      type: "ETF",
      risk: "Medium",
    },
    {
      name: "S&P 500 Index Fund",
      ticker: "SPY",
      allocation: 30,
      value: 976.30,
      change: 1.8,
      type: "Index Fund",
      risk: "Low",
    },
    {
      name: "Green Energy Fund",
      ticker: "GRNE",
      allocation: 15,
      value: 487.22,
      change: 4.5,
      type: "Mutual Fund",
      risk: "Medium",
    },
    {
      name: "Blue Chip Dividend",
      ticker: "DIV",
      allocation: 20,
      value: 650.18,
      change: 0.9,
      type: "ETF",
      risk: "Low",
    },
    {
      name: "Emerging Markets",
      ticker: "EM",
      allocation: 10,
      value: 324.50,
      change: -1.2,
      type: "ETF",
      risk: "High",
    },
  ];
  
  // Mock recommendations data
  const recommendations: Recommendation[] = [
    {
      name: "Artificial Intelligence ETF",
      ticker: "AIET",
      expected: 12.5,
      risk: "Medium-High",
      type: "Emerging Tech",
      description: "Exposure to companies developing AI technologies across various sectors.",
    },
    {
      name: "Sustainable Water Fund",
      ticker: "WATR",
      expected: 8.7,
      risk: "Medium",
      type: "ESG Investment",
      description: "Invests in companies focused on water purification, conservation, and infrastructure.",
    },
    {
      name: "Digital Payments Index",
      ticker: "DPAY",
      expected: 15.2,
      risk: "Medium-High",
      type: "Fintech",
      description: "Tracks companies transforming payment systems and digital transactions.",
    },
  ];
  
  // Chart data for portfolio performance
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        data: [3245.65, 3320.10, 3190.80, 3245.65],
        color: (opacity = 1) => colors.primary,
        strokeWidth: 2
      }
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.primary
    }
  };
  
  const total = portfolioData.reduce((sum, item) => sum + item.value, 0);
  
  // Simulate an AI response based on the user's query
  const generateAIResponse = (query: string): AIResponse => {
    // In a real app, this would call an API with RAG capabilities
    const responses: AIResponse[] = [
      {
        title: "Investment Strategies for Long-Term Growth",
        content: "Based on your query about long-term investments, I recommend considering a diversified portfolio with exposure to both growth and value stocks. ETFs like VTI (Vanguard Total Stock Market) offer broad market exposure with low fees. Additionally, considering allocating 15-20% to international markets for geographical diversification.",
        recommendations: ["VTI - Vanguard Total Stock Market ETF", "VXUS - Vanguard Total International Stock ETF", "SCHD - Schwab U.S. Dividend Equity ETF"]
      },
      {
        title: "Sustainable and ESG Investment Options",
        content: "For sustainable investing, consider funds that focus on environmental, social, and governance (ESG) criteria. ESGU (iShares ESG Aware USA ETF) provides exposure to companies with favorable ESG profiles. The clean energy sector also offers growth potential with funds like ICLN (iShares Global Clean Energy ETF).",
        recommendations: ["ESGU - iShares ESG Aware USA ETF", "ICLN - iShares Global Clean Energy ETF", "ESGD - iShares ESG Aware International ETF"]
      },
      {
        title: "Tech Sector Investment Analysis",
        content: "The technology sector continues to show strong growth potential, particularly in areas like AI, cloud computing, and cybersecurity. Instead of individual stocks which carry higher risk, consider ETFs like QQQ (Invesco QQQ Trust) for exposure to tech-heavy Nasdaq companies or CIBR (First Trust NASDAQ Cybersecurity ETF) for cybersecurity focus.",
        recommendations: ["QQQ - Invesco QQQ Trust", "CIBR - First Trust NASDAQ Cybersecurity ETF", "SKYY - First Trust Cloud Computing ETF"]
      }
    ];
    
    // Simple keyword matching to simulate intelligence
    if (query.toLowerCase().includes("sustain") || query.toLowerCase().includes("esg") || query.toLowerCase().includes("green")) {
      return responses[1];
    } else if (query.toLowerCase().includes("tech") || query.toLowerCase().includes("ai") || query.toLowerCase().includes("digital")) {
      return responses[2];
    } else {
      return responses[0];
    }
  };

  const handleAskAI = () => {
    if (investmentQuery.trim()) {
      const response = generateAIResponse(investmentQuery);
      setAiResponse(response);
      setQueryModalVisible(false);
      setModalVisible(true);
    }
  };

  const renderPortfolioTab = () => (
    <>
      {/* Portfolio Value Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: colors.grey }]}>Portfolio Value</Text>
          <Text style={[styles.portfolioValue, { color: colors.text }]}>
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.changeContainer}>
            <Ionicons name="arrow-up" size={16} color={colors.success} />
            <Text style={[styles.changeText, { color: colors.success }]}>
              2.4% ($78.50) this month
            </Text>
          </View>
          
          {/* Portfolio Chart */}
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 64}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 8
              }}
            />
          </View>
          
          <View style={styles.timeframeContainer}>
            <Chip 
              selected 
              onPress={() => {}} 
              style={[styles.timeframeChip, { backgroundColor: colors.primary }]}
              textStyle={{ color: '#fff' }}
            >
              1M
            </Chip>
            <Chip 
              onPress={() => {}} 
              style={styles.timeframeChip}
              textStyle={{ color: colors.text }}
            >
              3M
            </Chip>
            <Chip 
              onPress={() => {}} 
              style={styles.timeframeChip}
              textStyle={{ color: colors.text }}
            >
              6M
            </Chip>
            <Chip 
              onPress={() => {}} 
              style={styles.timeframeChip}
              textStyle={{ color: colors.text }}
            >
              1Y
            </Chip>
            <Chip 
              onPress={() => {}} 
              style={styles.timeframeChip}
              textStyle={{ color: colors.text }}
            >
              All
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Portfolio Holdings */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Portfolio Holdings</Text>
          
          {portfolioData.map((item, index) => (
            <React.Fragment key={index}>
              <View style={styles.holdingItem}>
                <View style={styles.holdingHeader}>
                  <View>
                    <Text style={[styles.holdingName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.holdingTicker, { color: colors.grey }]}>{item.ticker} • {item.type}</Text>
                  </View>
                  <View style={styles.holdingValues}>
                    <Text style={[styles.holdingValue, { color: colors.text }]}>
                      ${item.value.toFixed(2)}
                    </Text>
                    <Text 
                      style={[
                        styles.holdingChange, 
                        { color: item.change >= 0 ? colors.success : colors.danger }
                      ]}
                    >
                      {item.change >= 0 ? "+" : ""}{item.change}%
                    </Text>
                  </View>
                </View>
                <View style={styles.allocationContainer}>
                  <View 
                    style={[
                      styles.allocationBar, 
                      { width: `${item.allocation}%`, backgroundColor: colors.primary }
                    ]} 
                  />
                  <Text style={[styles.allocationText, { color: colors.grey }]}>
                    {item.allocation}% of portfolio
                  </Text>
                </View>
              </View>
              {index < portfolioData.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>
    </>
  );

  const renderRecommendationsTab = () => (
    <>
      <Text style={[styles.introText, { color: colors.grey }]}>
        Based on your risk profile and portfolio, our AI recommends these investments:
      </Text>
      
      {recommendations.map((item, index) => (
        <Card key={index} style={[styles.recommendationCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <View style={styles.recommendationHeader}>
              <View>
                <Text style={[styles.recommendationName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.recommendationTicker, { color: colors.grey }]}>
                  {item.ticker} • {item.type}
                </Text>
              </View>
              <Chip 
                style={[styles.riskChip, { 
                  backgroundColor: item.risk.includes("High") ? colors.warning : colors.success 
                }]}
              >
                {item.risk} Risk
              </Chip>
            </View>
            
            <Text style={[styles.recommendationDesc, { color: colors.grey }]}>
              {item.description}
            </Text>
            
            <View style={styles.expectedReturnContainer}>
              <Text style={[styles.expectedReturnLabel, { color: colors.grey }]}>
                Expected Annual Return:
              </Text>
              <Text style={[styles.expectedReturnValue, { color: colors.success }]}>
                {item.expected}%
              </Text>
            </View>
            
            <View style={styles.actionButtons}>
              <Button 
                mode="outlined" 
                onPress={() => {}} 
                style={[styles.actionButton, { borderColor: colors.primary }]}
                textColor={colors.primary}
              >
                Learn More
              </Button>
              <Button 
                mode="contained" 
                onPress={() => {}} 
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
              >
                Invest Now
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}
      
      <Card style={[styles.askAICard, { backgroundColor: colors.primary }]}>
        <Card.Content>
          <View style={styles.askAIContent}>
            <Ionicons name="bulb-outline" size={32} color="#fff" style={styles.aiIcon} />
            <View style={styles.askAITextContainer}>
              <Text style={styles.askAITitle}>Have investment questions?</Text>
              <Text style={styles.askAIDescription}>
                Ask our AI advisor about any investment topic or strategy
              </Text>
            </View>
          </View>
          <Button 
            mode="contained" 
            onPress={() => setQueryModalVisible(true)}
            style={[styles.askAIButton, { backgroundColor: '#fff' }]}
            textColor={colors.primary}
          >
            Ask AI Advisor
          </Button>
        </Card.Content>
      </Card>
    </>
  );

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>AI-Driven Investment Advisor</Text>
        
        {/* Tab navigation */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "portfolio" && [styles.selectedTab, { borderColor: colors.primary }]
            ]}
            onPress={() => setSelectedTab("portfolio")}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: selectedTab === "portfolio" ? colors.primary : colors.grey }
              ]}
            >
              Portfolio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "recommendations" && [styles.selectedTab, { borderColor: colors.primary }]
            ]}
            onPress={() => setSelectedTab("recommendations")}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: selectedTab === "recommendations" ? colors.primary : colors.grey }
              ]}
            >
              Recommendations
            </Text>
          </TouchableOpacity>
        </View>
        
        {selectedTab === "portfolio" ? renderPortfolioTab() : renderRecommendationsTab()}
      </ScrollView>
      
      {/* AI Response Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          {aiResponse && (
            <>
              <View style={styles.modalHeader}>
                <Ionicons name="analytics-outline" size={32} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>{aiResponse.title}</Text>
              </View>
              <Text style={[styles.modalContent, { color: colors.grey }]}>
                {aiResponse.content}
              </Text>
              <View style={styles.recommendationsList}>
                <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                  Recommended Investments:
                </Text>
                {aiResponse.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={[styles.recommendationText, { color: colors.text }]}>{rec}</Text>
                  </View>
                ))}
              </View>
              <Button 
                mode="contained" 
                onPress={() => setModalVisible(false)}
                style={[styles.closeButton, { backgroundColor: colors.primary }]}
              >
                Got it
              </Button>
            </>
          )}
        </Modal>
        
        <Modal
          visible={queryModalVisible}
          onDismiss={() => setQueryModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Ask AI Investment Advisor</Text>
          <Text style={[styles.modalContent, { color: colors.grey }]}>
            What would you like to know about investing?
          </Text>
          <TextInput
            mode="outlined"
            label="Enter your question"
            value={investmentQuery}
            onChangeText={setInvestmentQuery}
            multiline
            numberOfLines={3}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            style={styles.queryInput}
          />
          <View style={styles.queryExamples}>
            <Text style={[styles.examplesTitle, { color: colors.text }]}>Example questions:</Text>
            <TouchableOpacity onPress={() => setInvestmentQuery("What are the best long-term investment strategies?")}>
              <Text style={[styles.exampleItem, { color: colors.primary }]}>
                • What are the best long-term investment strategies?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setInvestmentQuery("How do I invest in sustainable or ESG funds?")}>
              <Text style={[styles.exampleItem, { color: colors.primary }]}>
                • How do I invest in sustainable or ESG funds?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setInvestmentQuery("What tech sector investments have the best growth potential?")}>
              <Text style={[styles.exampleItem, { color: colors.primary }]}>
                • What tech sector investments have the best growth potential?
              </Text>
            </TouchableOpacity>
          </View>
          <Button 
            mode="contained" 
            onPress={handleAskAI}
            style={[styles.askButton, { backgroundColor: colors.primary }]}
            disabled={!investmentQuery.trim()}
          >
            Ask Now
          </Button>
        </Modal>
      </Portal>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setQueryModalVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  selectedTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    marginLeft: 4,
    fontSize: 14,
  },
  chartContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  timeframeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  timeframeChip: {
    height: 30,
  },
  holdingItem: {
    marginBottom: 12,
  },
  holdingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  holdingName: {
    fontSize: 16,
    fontWeight: "500",
  },
  holdingTicker: {
    fontSize: 14,
  },
  holdingValues: {
    alignItems: "flex-end",
  },
  holdingValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  holdingChange: {
    fontSize: 14,
  },
  allocationContainer: {
    marginTop: 4,
  },
  allocationBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  allocationText: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 12,
  },
  introText: {
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 22,
  },
  recommendationCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  recommendationName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  recommendationTicker: {
    fontSize: 14,
  },
  riskChip: {
    height: 26,
  },
  recommendationDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  expectedReturnContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  expectedReturnLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  expectedReturnValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  askAICard: {
    marginBottom: 24,
    borderRadius: 12,
    elevation: 4,
  },
  askAIContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  aiIcon: {
    marginRight: 12,
  },
  askAITextContainer: {
    flex: 1,
  },
  askAITitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  askAIDescription: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  askAIButton: {
    borderRadius: 8,
  },
  modal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1,
  },
  modalContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  recommendationsList: {
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recommendationText: {
    marginLeft: 8,
    fontSize: 15,
  },
  closeButton: {
    borderRadius: 8,
  },
  queryInput: {
    marginBottom: 16,
  },
  queryExamples: {
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 8,
  },
  exampleItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  askButton: {
    borderRadius: 8,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});