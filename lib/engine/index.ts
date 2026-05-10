export { runSelectionEngine } from './selectionEngine';
export { getReviewQueue, clearReviewQueue } from './modules/manualReviewQueue';
export { classifyHalal, classifyHalalDetailed } from './modules/halalPolicyEngine';
export { assessSpiritualRisk } from './modules/spiritualRiskEngine';
export { assessModesty } from './modules/modestyPolicyEngine';
export { assessFinanceRisk } from './modules/ribaEngine';
export { submitFeedback, getFeedbackHistory } from './modules/feedbackLearningLoop';
export { updateAllScores } from './db/scoreUpdater';
export type {
  EngineInput,
  EngineResult,
  ProductScore,
  RejectedProduct,
  ReviewProduct,
  HalalStatus,
  RejectionReason,
  ClassificationResult,
  RiskScores,
} from './types';
