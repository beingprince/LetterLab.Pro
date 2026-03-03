/**
 * Canonical event logging for analytics
 * Ensures quota deductions and event totals always match
 */
import AnalyticEvent from '../models/AnalyticEvent.js';

/**
 * Log an analytics event with usage details
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.eventType - chat_turn | email_draft_created | subject_generated | summary_generated | thread_read | thread_analyzed | email_sent | reset_cycle
 * @param {number} [params.totalTokens=0]
 * @param {number} [params.inputTokens=0]
 * @param {number} [params.outputTokens=0]
 * @param {string} [params.provider='']
 * @param {string} [params.model='']
 * @param {string} [params.feature='']
 * @param {Object} [params.meta={}]
 */
export async function logAnalyticEvent({
  userId,
  eventType,
  totalTokens = 0,
  inputTokens = 0,
  outputTokens = 0,
  provider = '',
  model = '',
  feature = '',
  meta = {}
}) {
  try {
    await AnalyticEvent.create({
      userId,
      eventType,
      tokensUsed: totalTokens,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        provider,
        model
      },
      feature,
      meta,
      createdAt: new Date()
    });
  } catch (err) {
    console.error('[logAnalyticEvent] Failed:', err?.message);
  }
}
