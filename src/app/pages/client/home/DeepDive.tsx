import React from 'react';
import { Avatar, Box, Icon, Icons, Text } from 'folds';
import { useNavigate } from 'react-router-dom';
import { getDirectCreatePath } from '../../pathUtils';

const deepDiveVideos = [
  {
    id: 'consensus-review',
    title: 'How to run a high-context consensus review',
    summary:
      'A short explainer that kicks off a discussion about decisions, trade-offs, and linked references.',
    references: ['Decision log template', 'Facilitation checklist', 'Async recap doc'],
  },
  {
    id: 'incident-playback',
    title: 'Incident playback: from timeline to learning',
    summary:
      'Walk through a real timeline and capture what should become searchable knowledge for the whole team.',
    references: ['Timeline board', 'Postmortem notes', 'Runbook updates'],
  },
  {
    id: 'research-roundup',
    title: 'Research roundup: 3 signals worth discussing',
    summary:
      'Curated clips and links meant to spark open conversation and private friend-only follow-ups.',
    references: ['Source article set', 'Citation tracker', 'Action items'],
  },
];

export function HomeDeepDive() {
  const navigate = useNavigate();

  return (
    <Box direction="Column" gap="300" style={{ padding: 'var(--sp-normal)' }}>
      <Box direction="Column" gap="100">
        <Text size="H4">Deep Dive</Text>
        <Text size="T300">
          Swipe-style video queue designed to trigger informed discussion, save references, and keep
          a living repository of conversations.
        </Text>
      </Box>

      <Box
        direction="Column"
        gap="200"
        style={{
          padding: 'var(--sp-normal)',
          border: '1px solid var(--bg-surface-border)',
          borderRadius: 'var(--bo-rad-2)',
        }}
      >
        <Box direction="Column" gap="200" style={{ padding: 'var(--sp-normal)' }}>
          <Text size="L400">Conversation channels per video</Text>
          <Box direction="Column" gap="100">
            <Text size="T300">• Open chat: public room thread for broad discussion.</Text>
            <Text size="T300">
              • Private chat: friend-only room for sensitive context before sharing publicly.
            </Text>
            <Text size="T300">
              • Reference shelf: pinned links/files so each video becomes reusable knowledge.
            </Text>
          </Box>
          <Text size="T200">
            Tip: connect comments to an existing direct chat to continue privately.
          </Text>
        </Box>
      </Box>

      <Box direction="Column" gap="200">
        {deepDiveVideos.map((video) => (
          <Box
            key={video.id}
            direction="Column"
            gap="200"
            style={{
              padding: 'var(--sp-normal)',
              border: '1px solid var(--bg-surface-border)',
              borderRadius: 'var(--bo-rad-2)',
            }}
          >
            <Box direction="Column" gap="200" style={{ padding: 'var(--sp-normal)' }}>
              <Box alignItems="Center" gap="200">
                <Avatar size="300" radii="400">
                  <Icon src={Icons.Play} />
                </Avatar>
                <Box direction="Column" gap="50" grow="Yes">
                  <Text size="L400">{video.title}</Text>
                  <Text size="T300">{video.summary}</Text>
                </Box>
              </Box>
              <Box direction="Column" gap="50">
                <Text size="B300">References</Text>
                {video.references.map((reference) => (
                  <Text key={reference} size="T200">
                    • {reference}
                  </Text>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        alignItems="Center"
        gap="200"
        style={{
          padding: 'var(--sp-normal)',
          border: '1px solid var(--bg-surface-border)',
          borderRadius: 'var(--bo-rad-2)',
        }}
      >
        <Box alignItems="Center" gap="200" style={{ padding: 'var(--sp-normal)' }}>
          <Icon src={Icons.Chat} />
          <Box direction="Column" gap="50" grow="Yes">
            <Text size="L400">Need a private follow-up?</Text>
            <Text size="T300">
              Start a direct chat for friend-only discussion and keep the public comments focused.
            </Text>
          </Box>
          <Text
            as="button"
            size="B300"
            onClick={() => navigate(getDirectCreatePath())}
            style={{ cursor: 'pointer' }}
          >
            Open Chats
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
