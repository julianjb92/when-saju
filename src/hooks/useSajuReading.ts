/**
 * WHEN - React Hook for Saju Reading
 * Lovable에서 쉽게 사용할 수 있는 React Hook
 */

import { useState, useCallback } from 'react';
import { calculateSaju, formatSajuForEnglish, SajuResult } from '../saju-calculator';
import { generateFreeReading, generateFullReading } from '../ai-interpreter';

interface UserInput {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;
  birthCity: string;
  birthCountry: string;
  email?: string;
  gender?: 'male' | 'female';
}

interface ReadingState {
  isLoading: boolean;
  error: string | null;
  saju: SajuResult | null;
  formattedSaju: object | null;
  freeReading: string | null;
  fullReading: string | null;
}

export function useSajuReading(openaiApiKey: string) {
  const [state, setState] = useState<ReadingState>({
    isLoading: false,
    error: null,
    saju: null,
    formattedSaju: null,
    freeReading: null,
    fullReading: null,
  });

  // 사주 계산만 (AI 없이)
  const calculateOnly = useCallback((input: UserInput) => {
    const saju = calculateSaju(
      input.birthYear,
      input.birthMonth,
      input.birthDay,
      input.birthHour,
      input.gender
    );
    const formatted = formatSajuForEnglish(saju);
    
    setState(prev => ({
      ...prev,
      saju,
      formattedSaju: formatted,
    }));
    
    return { saju, formatted };
  }, []);

  // FREE 리딩 생성
  const generateFree = useCallback(async (input: UserInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 1. 사주 계산
      const saju = calculateSaju(
        input.birthYear,
        input.birthMonth,
        input.birthDay,
        input.birthHour,
        input.gender
      );
      const formatted = formatSajuForEnglish(saju);
      
      // 2. AI 해석 생성
      const birthDate = `${input.birthYear}-${String(input.birthMonth).padStart(2, '0')}-${String(input.birthDay).padStart(2, '0')}`;
      const reading = await generateFreeReading(
        saju,
        { name: input.name, birthDate },
        openaiApiKey
      );
      
      setState({
        isLoading: false,
        error: null,
        saju,
        formattedSaju: formatted,
        freeReading: reading,
        fullReading: null,
      });
      
      return { saju, formatted, reading };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [openaiApiKey]);

  // FULL 리딩 생성
  const generateFull = useCallback(async (input: UserInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 1. 사주 계산 (또는 기존 사용)
      const saju = state.saju || calculateSaju(
        input.birthYear,
        input.birthMonth,
        input.birthDay,
        input.birthHour,
        input.gender
      );
      const formatted = state.formattedSaju || formatSajuForEnglish(saju);
      
      // 2. AI 상세 해석 생성
      const birthDate = `${input.birthYear}-${String(input.birthMonth).padStart(2, '0')}-${String(input.birthDay).padStart(2, '0')}`;
      const reading = await generateFullReading(
        saju,
        { name: input.name, birthDate },
        openaiApiKey
      );
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        saju,
        formattedSaju: formatted,
        fullReading: reading,
      }));
      
      return { saju, formatted, reading };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [openaiApiKey, state.saju, state.formattedSaju]);

  // 상태 리셋
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      saju: null,
      formattedSaju: null,
      freeReading: null,
      fullReading: null,
    });
  }, []);

  return {
    ...state,
    calculateOnly,
    generateFree,
    generateFull,
    reset,
  };
}

export default useSajuReading;
